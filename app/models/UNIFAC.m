function [gamma] = UNIFAC(T,x,mixture_params,Unifac_GC)
%This function calculates the unifac coefficients for any compounds
%Written by Jacob Backhaus
%   T is the temperature [K]
%   x is the mole fraction of each component
%   mixture_params contains all of the groups, number of groups, needed to
%   solve UNIFAC for the activity coefficients
%   Unifac_GC contains all of the interaction parameters, group volume, and
%   group surface area for each group

%Unbundle unifac components
Unifac_interaction=Unifac_GC{3};    %unifac interaction parameters

groupfreq=mixture_params{2};    %frequency that each group occurs for each component (v_k^(i))

n_cmpts=length(x); %number of components in the mixture

%calculates residual for pure molecule solutions
[lngammaki,Groupnumb,Q,r,q]=Component(T,mixture_params,Unifac_GC);  

r=[r{1:n_cmpts}]; %concatinates r for all components in mixture
q=[q{1:n_cmpts}]; %concatinates q for all components in mixture

%Combinitorial component to the activity coefficient
[lngammac]=Combinatorial(x,r.',q.');

Q=[Q{1:n_cmpts}]; %concatinates Q for all components in mixture
Q=Q.';

Groupnumb=[Groupnumb{1:n_cmpts}]; %Concatinates Groupnumb
Groupnumb=Groupnumb.';

grps=zeros(n_cmpts,1);
% concentration of each group in mixture
X1=[];
for i=1:n_cmpts
X=groupfreq{i}.*x(i);
X1=cat(1,X1,X);
grps(i)=length(groupfreq{i});
end
X=X1./sum(X1); %group fraction for each group in the mixture

% residual activity coefficient whith a solution caintaining all groups
[lngamma_k]=lngammak(T,X,Q,Groupnumb,Unifac_interaction);

%concatinates activity coefficients of each group in their respective pure
%mixture
lngammaki=[lngammaki{1:n_cmpts}]; 
lngammaki=lngammaki.';

lngammar=zeros(n_cmpts,1);
lngammar(1)=sum(groupfreq{1}.*lngamma_k(1:grps(1))-lngammaki(1:grps(1)));
for i=2:n_cmpts
lngammar(i)=sum(groupfreq{i}.*(lngamma_k(sum(grps(1:i-1))+1:sum(grps(1:i)))-lngammaki(sum(grps(1:i-1))+1:sum(grps(1:i)))));
end

lngamma=lngammar+lngammac; %natural log of total activity coefficients
gamma=exp(lngamma); %total activity coefficient

end

